import React from "react";
import { useState, useCallback} from "react";
import {Header} from "./Header.tsx";
import {VoteModal} from "./modal/VoteModal.tsx";

// Main Wedding Invitation Component
const WeddingInvitation: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    return (
        <div className="font-sans antialiased relative">
            {/* Main Content */}
            <Header onOpenModal={openModal} />
            <VoteModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default WeddingInvitation;